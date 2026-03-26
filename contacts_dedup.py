import argparse
import csv
import json
import logging
import re
import sys
from typing import Any, Dict, List, Tuple


def normalize_phone(phone: str) -> str:
    """
    Нормализуем телефон Казахстана к каноническому виду для дедупликации.

    Требования из задачи:
    - номера вида `+7 ...`, `8 ...`, `7 ...` должны считаться одним номером
    - результат используется ТОЛЬКО для сравнения (dedup key)

    Принятые правила для простого валидатора:
    - оставляем только цифры
    - если начинается с `8`, заменяем `8` на `7`
    - если после удаления символов получилось 10 цифр и первая `7`, добавляем лидирующую `7`
      (т.е. делаем 11 цифр для страны)
    - считаем валидным только канонический номер длиной 11 цифр, начинающийся на `7`
    """
    digits = re.sub(r"\D+", "", phone or "")
    if not digits:
        return ""

    # Иногда в данных встречается международный префикс вида "007..."
    if digits.startswith("00"):
        digits = digits[2:]

    if digits.startswith("8"):
        # Локальный формат: 8XXXXXXXXX -> +7XXXXXXXXX (11 цифр)
        digits = "7" + digits[1:]

    if digits.startswith("7"):
        # Если нет country code (обычно бывает 10 цифр) — добавляем
        if len(digits) == 10:
            digits = "7" + digits

        # Нормально ожидаем 11 цифр: 7 + 10 цифр национального номера
        if len(digits) == 11:
            return digits

    # Всё остальное считаем невалидным для Казахстана в рамках этого скрипта.
    return ""


def format_kazakhstan_phone(phone_normalized: str) -> str:
    """
    Преобразует канонический номер (11 цифр вида 7XXXXXXXXXX)
    в удобный для чтения вид: +7 (XXX) XXX-XX-XX.
    """
    if not phone_normalized or len(phone_normalized) != 11 or not phone_normalized.startswith("7"):
        # Фоллбек: оставим как есть, но с плюсиком
        return f"+{phone_normalized}" if phone_normalized else ""

    a = phone_normalized[1:4]   # XXX
    b = phone_normalized[4:7]   # XXX
    c = phone_normalized[7:9]   # XX
    d = phone_normalized[9:11]  # XX
    return f"+7 ({a}) {b}-{c}-{d}"


def is_kazakhstan_phone(raw_phone: str) -> bool:
    """
    Проверка номера Казахстана через нормализацию.

    Важно: фильтрация должна зависеть от сути номера, а не от того,
    как он написан в исходных данных (`+7` vs `8` vs просто `7`).
    """
    return bool(normalize_phone(raw_phone))


def extract_name_and_phone(c: Dict[str, Any]) -> Tuple[str, str]:
    """
    Достаем поля 'name' и 'phone' из записи (JSON/CSV могут отличаться заголовками).
    """
    # Приводим ключи к нижнему регистру, чтобы было устойчиво к вариантам 'Name'/'name'.
    lc = {str(k).strip().lower(): v for k, v in c.items()}

    name = lc.get("name") or lc.get("имя") or lc.get("fullname") or ""
    raw_phone = (
        lc.get("phone")
        or lc.get("телефон")
        or lc.get("tel")
        or lc.get("mobile")
        or lc.get("моб")
        or ""
    )

    return str(name).strip(), str(raw_phone).strip()


def deduplicate_contacts(
    contacts: List[Dict[str, Any]],
    logger: logging.Logger,
) -> Tuple[List[Dict[str, str]], Dict[str, int]]:
    """
    Удаляет дубликаты контактов по номеру телефона.

    Правило:
    - первый встретившийся контакт с конкретным номером сохраняется
    - остальные с тем же номером отбрасываются
    """
    seen_phones = set()
    result: List[Dict[str, str]] = []

    stats = {
        "input_contacts": len(contacts),
        "kept_contacts": 0,
        "skipped_no_phone": 0,
        "skipped_invalid_phone": 0,
        "duplicates_removed": 0,
    }

    # Чтобы лог не разрастался на больших выгрузках — логируем причины пропусков ограниченно.
    max_detail_logs = 100
    invalid_logs_count = 0
    no_phone_logs_count = 0
    dup_logs_count = 0

    for idx, c in enumerate(contacts):
        name, raw_phone = extract_name_and_phone(c)

        if not raw_phone:
            stats["skipped_no_phone"] += 1
            if no_phone_logs_count < max_detail_logs:
                logger.warning("Пропуск: нет телефона. idx=%s name=%s raw_phone='%s'", idx, name, raw_phone)
                no_phone_logs_count += 1
            continue

        # Нормализуем до канонической формы. Если не получилось — номер невалиден/не Казахстан.
        phone_key = normalize_phone(raw_phone)
        if not phone_key:
            stats["skipped_invalid_phone"] += 1
            if invalid_logs_count < max_detail_logs:
                logger.warning(
                    "Пропуск: невалидный телефон. idx=%s name=%s raw_phone=%s reason=не удалось нормализовать в +7-формат",
                    idx,
                    name,
                    raw_phone,
                )
                invalid_logs_count += 1
            continue

        if phone_key in seen_phones:
            stats["duplicates_removed"] += 1
            if dup_logs_count < max_detail_logs:
                logger.info(
                    "Дубликат: оставлен первый. idx=%s name=%s raw_phone=%s normalized=%s",
                    idx,
                    name,
                    raw_phone,
                    phone_key,
                )
                dup_logs_count += 1
            continue

        seen_phones.add(phone_key)
        # Разделяем: phone_key (нормализованный) используется для сравнения,
        # а в итоговый CSV кладём читаемый формат.
        phone_display = format_kazakhstan_phone(phone_key)
        result.append({"name": name, "phone": phone_display})
        stats["kept_contacts"] += 1

    logger.info(
        "Итоги: вход=%s, сохранено=%s, дублей=%s, пропущено без телефона=%s, пропущено невалидных=%s",
        stats["input_contacts"],
        stats["kept_contacts"],
        stats["duplicates_removed"],
        stats["skipped_no_phone"],
        stats["skipped_invalid_phone"],
    )
    return result, stats


def read_contacts_from_csv(path: str) -> List[Dict[str, Any]]:
    """
    Читает список контактов из CSV.

    Поддерживаемые заголовки (варианты):
    - name / Имя / fullname
    - phone / Телефон / tel / mobile / Моб ...
    """
    if path == "-":
        reader = csv.DictReader(sys.stdin)
        return list(reader)

    with open(path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        return list(reader)


def setup_logger(log_path: str) -> logging.Logger:
    """Создает логгер с записью в файл."""
    logger = logging.getLogger("contacts_dedup")
    logger.setLevel(logging.INFO)

    # Если скрипт запустили повторно в одном процессе, убираем старые обработчики.
    if logger.handlers:
        logger.handlers.clear()

    handler = logging.FileHandler(log_path, encoding="utf-8")
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
    handler.setFormatter(formatter)

    logger.addHandler(handler)
    return logger


def read_contacts_from_input(path: str) -> List[Dict[str, Any]]:
    """Автоопределяет формат входных данных: JSON или CSV (по расширению файла)."""
    if path == "-":
        # Для stdin без расширения считаем, что это JSON.
        return read_contacts_from_json(path)

    lower = path.lower()
    if lower.endswith(".json"):
        return read_contacts_from_json(path)
    if lower.endswith(".csv"):
        return read_contacts_from_csv(path)

    raise ValueError("Неизвестный формат файла. Ожидается .json или .csv")


def read_contacts_from_json(path: str) -> List[Dict[str, Any]]:
    """
    Читает список контактов из JSON.

    Ожидаемый формат JSON:
    [
      {"name": "Иван", "phone": "+7 (999) 123-45-67"},
      {"name": "Петр", "phone": "8 999 123 45 67"}
    ]
    """
    if path == "-":
        return json.load(sys.stdin)

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_contacts_to_csv(path: str, contacts: List[Dict[str, str]]) -> None:
    """Сохраняет контакты в CSV файл с колонками: name, phone."""
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "phone"])
        writer.writeheader()
        writer.writerows(contacts)


def main() -> None:
    parser = argparse.ArgumentParser(description="Дедупликация контактов и сохранение в CSV.")
    parser.add_argument(
        "--log",
        default="contacts_dedup.log",
        help="Путь к файлу логов (по умолчанию: contacts_dedup.log)",
    )
    parser.add_argument("--output", default="contacts.csv", help="Путь к CSV файлу (по умолчанию: contacts.csv)")
    parser.add_argument(
        "--input",
        default="",
        help="Путь к файлу со списком контактов: .json или .csv. Можно указать '-' для чтения из stdin.",
    )
    args = parser.parse_args()

    logger = setup_logger(args.log)
    logger.info("Запуск: input=%s output=%s log=%s", args.input, args.output, args.log)

    # Пример "встроенного" списка контактов.
    # Если хотите — замените CONTACTS на ваши данные или используйте --input.
    CONTACTS = [
        {"name": "Иван", "phone": "+7 (999) 123-45-67"},
        {"name": "Иван (дубликат)", "phone": "8 999 123 45 67"},
        {"name": "Иван (дубликат 2)", "phone": "7 999 123 45 67"},
        {"name": "Петр", "phone": "+7 911 555 00 11"},
    ]

    contacts_raw: List[Dict[str, Any]]
    if args.input:
        contacts_raw = read_contacts_from_input(args.input)
    else:
        contacts_raw = CONTACTS

    # Дедупликация + нормализация для сохранения
    contacts_clean, stats = deduplicate_contacts(contacts_raw, logger)

    # Сохранение в CSV
    write_contacts_to_csv(args.output, contacts_clean)
    logger.info("Запись результата: %s контактов -> %s", stats["kept_contacts"], args.output)
    print(f"Готово: записано {len(contacts_clean)} контактов в {args.output}")


if __name__ == "__main__":
    main()


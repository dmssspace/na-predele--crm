import React from "react";
import { Input } from "antd";
import type { InputProps } from "antd";

interface PhoneInputProps extends Omit<InputProps, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Компонент для ввода номера телефона с маской +7 (XXX) XXX-XX-XX
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = "",
  onChange,
  ...props
}) => {
  const formatPhoneNumber = (input: string): string => {
    // Удаляем все нецифровые символы
    const digits = input.replace(/\D/g, "");
    
    // Если начинается с 8, заменяем на 7
    const normalizedDigits = digits.startsWith("8") 
      ? "7" + digits.slice(1) 
      : digits.startsWith("7") 
        ? digits 
        : "7" + digits;
    
    // Ограничиваем до 11 цифр
    const limitedDigits = normalizedDigits.slice(0, 11);
    
    // Форматируем в +7 (XXX) XXX-XX-XX
    let formatted = "+7";
    
    if (limitedDigits.length > 1) {
      formatted += " (" + limitedDigits.slice(1, 4);
    }
    
    if (limitedDigits.length >= 4) {
      formatted += ")";
    }
    
    if (limitedDigits.length >= 5) {
      formatted += " " + limitedDigits.slice(4, 7);
    }
    
    if (limitedDigits.length >= 8) {
      formatted += "-" + limitedDigits.slice(7, 9);
    }
    
    if (limitedDigits.length >= 10) {
      formatted += "-" + limitedDigits.slice(9, 11);
    }
    
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue);
    
    // Извлекаем только цифры для сохранения
    const digitsOnly = inputValue.replace(/\D/g, "");
    const normalizedDigits = digitsOnly.startsWith("8") 
      ? "7" + digitsOnly.slice(1) 
      : digitsOnly.startsWith("7") 
        ? digitsOnly 
        : "7" + digitsOnly;
    
    onChange?.(normalizedDigits.slice(0, 11));
  };

  const displayValue = value ? formatPhoneNumber(value) : "";

  return (
    <Input
      {...props}
      value={displayValue}
      onChange={handleChange}
      placeholder="+7 (___) ___-__-__"
      maxLength={18}
    />
  );
};

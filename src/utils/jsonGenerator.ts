import crypto from "crypto";
import RandExp from "randexp";
import { PropertySchema } from "../interface/PropertySchema";
import {
  ALPHA_NUM,
  SUPPORTED_DATE_FORMATS,
  MONTH_ABBREVIATIONS,
  COUNTRIES_CODE_PHONE,
} from "../constants/constants";

export class JsonGenerator {
  generateJsonFromSchema(
    propertySchema: PropertySchema,
    propertyPath: string[] = []
  ): any {
    const {
      type,
      format,
      pattern,
      enum: enumValues,
      useDefault,
      default: defaultValue,
      minimum,
      maximum,
      minLength,
      maxLength,
      length,
      items,
      properties,
      countryCode,
    } = propertySchema;

    switch (type) {
      case "integer":
        const minInt = minimum || 0;
        const maxInt = maximum || Number.MAX_SAFE_INTEGER;
        return useDefault && defaultValue
          ? defaultValue
          : parseInt(String(Math.random() * (maxInt - minInt + 1))) + minInt;

      case "string":
        return this.generateString({
          format,
          pattern,
          enumValues,
          useDefault,
          defaultValue,
          length,
          minLength,
          maxLength,
          countryCode,
        });

      case "object":
        return this.generateObjectData(properties!, propertyPath);

      case "array":
        return this.generateArrayData(items!, propertyPath);

      case "boolean":
        return Boolean(crypto.randomBytes(1)[0] & 1);

      case "date":
        return useDefault
          ? defaultValue || this.generateRandomDate()
          : this.generateRandomDate(format);

      default:
        return defaultValue || null;
    }
  }

  private generateString(options: {
    format?: string;
    pattern?: RegExp;
    enumValues?: any[];
    useDefault?: boolean;
    defaultValue?: any;
    length?: number;
    minLength?: number;
    maxLength?: number;
    countryCode?: string;
  }): string {
    const {
      format,
      pattern,
      enumValues,
      useDefault,
      defaultValue,
      length,
      minLength,
      maxLength,
      countryCode,
    } = options;
    let generatedString = "";

    if (format && !useDefault && !countryCode) {
      generatedString = this.generateRandomValueFromFormat({ format });
    } else if (countryCode && format === "phone") {
      generatedString = this.generateRandomValueFromFormat({
        format,
        countryCode,
      });
    } else if (pattern) {
      const regex = new RegExp(pattern);
      do {
        const randExp = new RandExp(regex);
        generatedString = randExp.gen();
      } while (!regex.test(generatedString));
    } else if (
      enumValues &&
      Array.isArray(enumValues) &&
      enumValues.length > 0
    ) {
      generatedString =
        enumValues[Math.floor(Math.random() * enumValues.length)];
    } else {
      const len = length || 10;
      generatedString =
        useDefault && defaultValue
          ? defaultValue
          : this.generateRandomValue(len);
    }

    return minLength && generatedString.length < minLength
      ? generatedString.padEnd(minLength, "*").substring(0, minLength)
      : maxLength && generatedString.length > maxLength
      ? generatedString.substring(0, maxLength)
      : generatedString;
  }

  private generateObjectData(
    properties: { [key: string]: PropertySchema },
    propertyPath: string[]
  ): any {
    const generatedObject: { [key: string]: any } = {};
    for (const subProperty in properties) {
      const subPropertyData = this.generateJsonFromSchema(
        properties[subProperty],
        propertyPath.concat([subProperty])
      );
      generatedObject[subProperty] = subPropertyData;
    }
    return generatedObject;
  }

  private generateArrayData(
    items: PropertySchema[],
    propertyPath: string[]
  ): any[] {
    return items.map((item, i) =>
      this.generateJsonFromSchema(
        item,
        propertyPath.concat(["items", i.toString()])
      )
    );
  }

  private generateRandomValue(length: number): string {
    const randomBytes = crypto.randomBytes(length);
    return Array.from(randomBytes, (b) =>
      ALPHA_NUM.charAt(b % ALPHA_NUM.length)
    ).join("");
  }

  private generateRandomValueFromFormat(options: {
    format?: string;
    countryCode?: string;
  }): string {
    const { format, countryCode = "FR" } = options;
    switch (format) {
      case "email":
        return this.generateRandomEmail();
      case "phone":
        return this.generatePhoneNumber(countryCode);
      default:
        return "";
    }
  }

  private generateRandomEmail(domain: string = "@example.com"): string {
    const usernameLength = 8;
    const username = this.generateRandomValue(usernameLength);
    return `${username}${domain}`;
  }

  private generateRandomDate(format?: string): string {
    let year: number | undefined,
      month: string | number | undefined,
      day: string | number | undefined;

    if (!format) {
      const currentDate = new Date();
      year = currentDate.getFullYear();
      month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      day = currentDate.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    if (!SUPPORTED_DATE_FORMATS.includes(format)) {
      throw new Error(`Invalid date format: ${format}`);
    }

    if (format.includes("YYYY")) year = 1900 + Math.floor(Math.random() * 100);
    if (format.includes("MM"))
      month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
    if (format.includes("MMM"))
      month =
        MONTH_ABBREVIATIONS[
          Math.floor(Math.random() * MONTH_ABBREVIATIONS.length)
        ];
    if (format.includes("DD")) {
      const numericMonth =
        typeof month === "number"
          ? month
          : typeof month === "string" && !isNaN(parseInt(month))
          ? parseInt(month)
          : 1; // Default fallback month

      const maxDays = this.getMaxDays(numericMonth, year || 2000);
      day = String(1 + Math.floor(Math.random() * maxDays)).padStart(2, "0");
    }

    return format.replace(
      /(YYYY)|(YY)|(MM)|(MMM)|(DD)/g,
      (match: string): string => {
        switch (match) {
          case "YYYY":
            return String(year);
          case "YY":
            return String(year).slice(-2);
          case "MM":
            return month as string;
          case "MMM":
            return month as string;
          case "DD":
            return day as string;
          default:
            return match;
        }
      }
    );
  }

  private getMaxDays(month: number, year: number): number {
    switch (month) {
      case 2:
        return this.isLeapYear(year) ? 29 : 28;
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
      default:
        return 31;
    }
  }

  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  private generatePhoneNumber(countryCode: string): string {
    const phoneRegex = COUNTRIES_CODE_PHONE[countryCode];
    if (!phoneRegex) throw new Error(`Invalid country code: ${countryCode}`);
    const regex = new RegExp(phoneRegex);
    let phoneNumber;
    do {
      const randExp = new RandExp(regex);
      phoneNumber = randExp.gen();
    } while (!regex.test(phoneNumber));
    return phoneNumber;
  }
}

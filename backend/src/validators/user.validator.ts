import { UtilsValidator } from "./utils.validator";

export class UserValidator {
    static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    static readonly PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    static validateUserId(userId: string): boolean {
        return UtilsValidator.validateId(userId);
    }

    static validateEmail(email: string): boolean {
        return UserValidator.EMAIL_REGEX.test(email);
    }

    static validatePasswordStrength(password: string): boolean {
        return this.PASSWORD_REGEX.test(password);
    }
}

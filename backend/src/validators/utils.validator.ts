export class UtilsValidator {
    static readonly ID_REGEX = /^[0-9a-fA-F-]{36}$/;
    
    static validateId(id: string): boolean {
        return UtilsValidator.ID_REGEX.test(id);
    }
}

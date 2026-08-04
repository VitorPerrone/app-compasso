export const format = {

    phone(phone: string): string {
        const digits = phone.replace(/\D/g, '');
        const match = digits.match(/^(\d{2})(\d{4,5})(\d{4})$/);
        if (match) {
            return `(${match[1]})${match[2]}-${match[3]}`;
        }
        return digits;
    }
    
}
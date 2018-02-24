export default class Color {
    static getRGBFromHex (hex) {
        return {
            red: (hex & 0xFF0000) >> 16,
            green: (hex & 0x00FF00) >> 8,
            blue: hex & 0x0000FF
        }
    }
}

export default class RadioApi {
    // unsecure (may remain this way)
    static async fetchRadio (station) {
        const radio = await Util.requestJSON(`radio/${station}`)
        return radio
    }
}

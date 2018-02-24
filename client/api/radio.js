import { Network } from '@/script/fscript'

export default class RadioApi {
    // unsecure (may remain this way)
    static async fetchRadio (station) {
        const radio = await Network.requestJSON(`radio/${station}`)
        return radio
    }
}

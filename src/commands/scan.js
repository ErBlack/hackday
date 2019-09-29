import {availableNetworks} from './fs/mashine';
import {toRow} from './fs';

export default function scan() {
    const available = availableNetworks();

    if (available.length) {
        return '\n' + availableNetworks()
            .map(({name, ip}) => toRow(name, ip))
            .join('\n') + '\n\n';
    }
}
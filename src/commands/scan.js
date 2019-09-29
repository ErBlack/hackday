import {availableNetworks} from './fs/mashine';
import {toRow} from './fs';

export default function scan() {
    return '\n' + availableNetworks()
        .map(({name, ip}) => toRow(name, ip))
        .join('./') + '\n\n';
}
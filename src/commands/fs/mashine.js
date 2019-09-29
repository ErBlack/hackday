let current = 'hacker';

const mashines = {
    hacker: {
        dir: ['home', 'zerocool'],
        network: 'local',
        access: ['common'],
        need_ssh_key: false,
        ip: '199.19.14.201'
    },
    lauren: {
        dir: ['home', 'lauren'],
        network: 'common',
        access: ['common', 'emc'],
        need_ssh_key: false,
        ip: '198.41.10.124'
    },
    plague: {
        dir: ['home', 'plague'],
        network: 'ems',
        access: ['common', 'emc'],
        need_ssh_key: false,
        ip: '199.27.91.131'
    },
    gibson: {
        dir: ['home', 'root'],
        network: 'ems',
        access: ['common', 'emc'],
        need_ssh_key: true,
        ip: '192.15.45.241'
    },
    rucker: {
        dir: ['home', 'root'],
        network: 'ems',
        access: ['common', 'emc'],
        need_ssh_key: true,
        ip: '193.10.14.129'
    },
    sterling: {
        dir: ['home', 'root'],
        network: 'ems',
        access: ['common', 'emc'],
        need_ssh_key: true,
        ip: '202.12.27.133'
    }
}

export const currentMashine = () => mashines[current];

export const availableNetworks = () => {
    const {access} = mashines[current];

    return Object.keys(mashines).reduce((list, name) => {
        if (current !== name) {
            const {network, ip} = mashines[name];

            if (access.includes(network)) {
                list.push({name, ip});
            }
        }

        return list;
    }, []);
}
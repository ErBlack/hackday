export default function help(command) {
    if (HELP[command]) return HELP[command];

    return `
GNU bash, version 6.4.12
------------------------------------------
help помощь
help [name] помощь по команде

pwd         показать текущую директорию
ls          показать содержимое директории
cd          перейти в директорию
read        прочитать файл
scan        сканировать сеть
ssh         подключиться к компьютеру
ssh-add     добавить ключ
clear       очистить экран

`;
}

const HELP = {
    pwd: 'pwd: выводит в консоль текущую директорию',
    ls: 'ls: выводит содержимое текущей диреткории',
    cd: `cd: переносит в директорию

cd home     перейти в подиректорию home,
            если в текущей директории есть
            поддиректория home
cd ../      перейти в родительсую директорию

`,
    read: `read: выводит содержимое файла
    
read fi.txt выводит в консоль содержимое
            файла fi.txt, если он есть в
            текущей директории

`,
    scan: 'scan: сканирует сеть, выводит список доступных адресов',
    ssh: `ssh: подключение к удалённому компьютеру

ssh 199.19.14.201 подключиться к компьютеру
            с адресом 199.19.14.201
            
            может потребоваться пароль
            может потребоваться ключ

`,
    'ssh-add': `ssh-add: добавляет ключ для подключений

ssh-add rsa добавляет ключ rsa в агент
            если ключ лежит в текущей
            папке`,
    clear: 'celar: удаляет всё с экрана'

}
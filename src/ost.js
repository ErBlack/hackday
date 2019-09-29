function loadSound(src) {
    const audio = new Audio();
    Object.assign(audio, {
        preload: true,
        src: src
    });

    return audio;
}

export const start = loadSound('/hackday/1.mp3');
export const levelup = loadSound('/hackday/2.mp3');
export const final = loadSound('/hackday/3.mp3');

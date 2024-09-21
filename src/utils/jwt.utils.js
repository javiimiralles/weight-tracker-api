import jwt from 'jsonwebtoken';

export const generateJWT = (uid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid
        }

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1y'
        }, (err, token) => {
            if (err) {
                console.error(err);
                reject('Error generando el JWT');
            } else {
                resolve(token);
            }
        });
    });
}

export const infoToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}
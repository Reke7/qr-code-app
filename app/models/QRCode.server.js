export async function getQRCode(id, graphql){
    const qrCode = await db.qrCode.findFirst({ where: { id } });

    if (!qrCode) {
        return null;
    }

    return supplementQRCode(qrCode, graphql);
}

export async function getQRCodes(shop, graphql){
    const qrCodes = await db.qrCode.findMany({
        where: { shop },
        orderBy: { createdAt: 'desc' }
    });

    return Promise.all(qrCodes.map((qrCode) => supplementQRCode(qrCode, graphql)));
}
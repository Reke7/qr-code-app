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

export function getQRCodeImage(id) {
    const url = new URL(`/qrcodes/${id}/scan`, process.env.SHOPIFY_APP_URL);
    return qrcode.toDataURL(url.href);
}

// Scanning a QR code takes the user to a specific destination (the product detail page or a checkout with the product in the cart).
export function getDestinationURL(qrCode) {
    if (qrCode.destination === "product") {
        return `https://${qrCode.shop}/products/${qrCode.productHandle}`;
    }

    const match = /gid:\/\/shopify\/ProductVariant\/([0-9]+)/.exec(qrCode.productVariantId);
    invariant(match, "Product variant ID is not valid");

    return `https://${qrCode.shop}/cart/${match[1]}:1`;
}
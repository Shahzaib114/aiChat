import React from 'react';

const ExtractPriceAndPeriod = (description: any) => {
    const priceArray = description
        .split('\n')
        .map((item: any) => item.trim().replace(/,$/, '')) // Trim whitespace and trailing comma
        .filter((item: any) => item) // Remove any empty strings
        .map((item: any) => {
            const regex = /([\d.]+\$)\/(month|week|year)/;
            const match = item.match(regex);
            if (match) {
                const [_, price, period] = match;
                return { id: item.split(':')[0].trim(), price, period };
            } else {
                return { id: item.split(':')[0].trim(), price: item.split(':')[1].trim(), period: '' };
            }
        });
    return priceArray
};

export default ExtractPriceAndPeriod;
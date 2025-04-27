import { compare_str_ne, fmt_tags_key, mass_to_g, parse_mass_unit, price_to_formatted, symbols } from "$root";
import type { ListingOrder, ListingOrderDiscount } from "@radroots/radroots-common-bindings";

export type IListingOrderCreate = {
    tags_prices: string[][];
    tags_quantities: string[][];
    tags_discounts: string[][];
    quantity: {
        amount: number;
        unit: string;
        count: number;
    };
};

export const listing_order_create = (opts: IListingOrderCreate): ListingOrder => {
    const {
        tags_prices, tags_quantities, tags_discounts,
        quantity: { amount: qty_amt, unit: qty_unit, count: qty_count }
    } = opts;

    const qty_key = fmt_tags_key(qty_amt, qty_unit);
    const qty_tag = tags_quantities.find(t => fmt_tags_key(t[1], t[2]) === qty_key);
    if (!qty_tag) throw new Error(`invalid quantity tag`);

    const [, qty_tag_amt, qty_tag_unit, qty_tag_label] = qty_tag;
    const qty_unit_parsed = parse_mass_unit(qty_tag_unit);
    if (!qty_unit_parsed) throw new Error(`invalid quantity unit`);

    const price_qty_key = fmt_tags_key(qty_tag_amt, qty_tag_unit, qty_tag_label);
    const price_tag = tags_prices.find(t => t[5]?.toLowerCase() === price_qty_key);
    if (!price_tag) throw new Error(`invalid price tag`);

    const [, price_tag_amt, price_tag_currency, price_tag_qty_amt, price_tag_qty_unit] = price_tag;
    const price_unit_parsed = parse_mass_unit(price_tag_qty_unit);
    if (!price_unit_parsed) throw new Error(`invalid price unit`);

    const qty_amt_num = parseFloat(qty_tag_amt);
    const price_amt = parseFloat(price_tag_amt);
    const price_qty_amt = parseFloat(price_tag_qty_amt);

    const mass_g = mass_to_g(qty_amt_num * qty_count, qty_tag_unit);
    const price_group_g = mass_to_g(price_qty_amt, price_tag_qty_unit);
    const group_count = mass_g / price_group_g;
    const subtotal = price_to_formatted(group_count * price_amt, price_tag_currency);

    const discounts: ListingOrderDiscount[] = [];

    for (const discount of tags_discounts) {
        const discount_type = discount[0];

        if (discount_type === `price-discount-subtotal`) {
            const [, threshold_str, currency, value_str, mode] = discount;
            if (compare_str_ne(currency, price_tag_currency)) continue;
            const threshold = parseFloat(threshold_str);
            if (subtotal < threshold) continue;

            if (mode === symbols.percent) {
                const percent = parseFloat(value_str);
                discounts.push({
                    discount_type: `subtotal`,
                    threshold,
                    discount_percent: percent,
                    discount_amount: price_to_formatted(subtotal * percent / 100, currency),
                    currency
                });
            } else {
                const amount = parseFloat(value_str);
                discounts.push({
                    discount_type: `subtotal`,
                    threshold,
                    discount_amount: price_to_formatted(amount, currency),
                    currency
                });
            }
        }

        if (discount_type === `price-discount-mass`) {
            const [, discount_unit, threshold_str, threshold_unit, per_unit_str, currency] = discount;
            if (compare_str_ne(currency, price_tag_currency)) continue;
            const threshold = parseFloat(threshold_str);
            const mass_in_threshold = mass_g / mass_to_g(1, threshold_unit);
            if (mass_in_threshold < threshold) continue;

            const per_unit = parseFloat(per_unit_str);
            const unit_count = mass_g / mass_to_g(1, discount_unit);
            discounts.push({
                discount_type: `mass`,
                threshold,
                threshold_unit,
                discount_per_unit: per_unit,
                discount_unit,
                discount_amount: price_to_formatted(unit_count * per_unit, currency),
                currency
            });
        }

        if (discount_type === `price-discount-quantity`) {
            const [, key, min_str, per_unit_str, currency] = discount;
            if (compare_str_ne(currency, price_tag_currency)) continue;
            if (key !== price_qty_key) continue;
            const min = parseInt(min_str);
            if (qty_count < min) continue;
            const per_unit = parseFloat(per_unit_str);
            discounts.push({
                discount_type: `quantity`,
                threshold: min,
                discount_per_unit: per_unit,
                discount_amount: price_to_formatted(per_unit * qty_count, currency),
                currency
            });
        }
    }

    const total_discount = price_to_formatted(discounts.reduce((acc, d) => acc + d.discount_amount, 0), price_tag_currency);
    const subtotal_amt = price_to_formatted(subtotal, price_tag_currency);
    const total_amt = price_to_formatted(subtotal - total_discount, price_tag_currency);

    return {
        quantity: {
            amount: qty_amt_num,
            unit: qty_unit_parsed,
            label: qty_tag_label,
            count: qty_count,
        },
        price: {
            amount: price_amt,
            currency: price_tag_currency,
            quantity_amount: price_qty_amt,
            quantity_unit: price_unit_parsed
        },
        discounts,
        subtotal: {
            price_amount: subtotal_amt,
            price_currency: price_tag_currency,
            quantity_amount: qty_amt_num * qty_count,
            quantity_unit: qty_tag_unit
        },
        total: {
            price_amount: total_amt,
            price_currency: price_tag_currency,
            quantity_amount: qty_amt_num * qty_count,
            quantity_unit: qty_tag_unit
        }
    };
};

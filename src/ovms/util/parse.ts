
// from https://stackoverflow.com/a/6969486/9816338
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function parseValueByIdentifier(id: string, response: string): string | undefined {
    const r = new RegExp('\\s*' + escapeRegExp(id) + ':?\\s*(.*)\\s*')
    const matches = response.match(r)
    return matches && matches.length === 2 ? matches[1] : undefined
}
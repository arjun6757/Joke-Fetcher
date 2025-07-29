const JOKE_API = 'https://v2.jokeapi.dev'

export async function handler(req, res) {

    const { category } = req.params

    const { flags } = req.query

    try {

        if (!category) {
            throw new Error('Category is required')
        }

        let url = `${JOKE_API}/joke/${category}`

        if (flags) url += `?blacklistFlags=${flags}`

        if ('safe-mode' in req.query) {
            if (flags) {
                url += '&safe-mode'
            } else {
                url += '?safe-mode'
            }
        }

        console.log(url)
        const response = await fetch(url)

        if (!response.ok) {
            const result = await response.json()
            throw new Error(result.message || "Response failed")
        }

        const result = await response.json()

        res.status(200).json({ message: 'Joke fetched successfully', data: result })
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Something went wrong" })
    }
}
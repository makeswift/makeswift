import { NextApiRequest, NextApiResponse } from "next"

type PlaceTextSearchResult = {
  formatted_address: string
  geometry: { location: { lat: number; lng: number } }
}

type PlaceTextSearchResponse = {
  results: PlaceTextSearchResult[]
}

export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q: query } = req.query

  if (typeof query !== "string") {
    res.status(400).json({ error: "Query must be string" })
  } else if (query === "" || !process.env.GOOGLE_MAPS_API_KEY) {
    res.json([])
  } else {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/textsearch/json"
    )
    url.searchParams.set("key", process.env.GOOGLE_MAPS_API_KEY)
    url.searchParams.set("query", query)
    const response = await fetch(url.toString())
    const data: PlaceTextSearchResponse = await response.json()

    res.json(
      data.results.map(
        ({
          formatted_address,
          geometry: {
            location: { lat, lng },
          },
        }: PlaceTextSearchResult) => ({
          label: formatted_address,
          value: { lat, lng, label: formatted_address },
          id: lat,
        })
      )
    )
  }
}

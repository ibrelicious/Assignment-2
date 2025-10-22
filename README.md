# Assignment 2 — NASA API
## Så använder man denna fetch

Öppna index.html i en webbläsare (eller använd WebStorms inbyggda server).

Vad koden gör (flöde)
Fetch + async/await: Hämtar JSON från https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=....

Normaliserar rå-JSON till platta objekt för enklare bearbetning.
Använder följande array-metoder:
map — normalisera data och bygga kompakta sammanfattningar,
filter — välja foton som matchar en given kamerakategori,
reduce — bygga frekvensobjekt (antal per kamera),
flatMap — platta ut kamernamn över foton,
some / every — snabba datakontroller,
sort — alfabetiska titlar och toppfrekvenser,
slice — visa “första 5”.

Skriver ut:
De första 5 kamera namnen (alfabetiskt).
Alla foton för en given kategori (kamerans fullständiga namn) i formatet: name/category.
Ett räknarobjekt över hur många foton per kategori (kamera).

Stretch:
groupBy(items, keyOrFn) — gruppera efter kamera eller sol.
Select & reshape — kompakta sammanfattningar: { id, name, category, date, image, cameras }.
Frequency map — hur ofta varje kamera förekommer (via flatMap + reduce).

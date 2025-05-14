# Login / Punchcard App created using React + Vite

Käyttöohjeet:

Työläinen klikkaa omaa nimeä tullessaan työpaikalle.

Klikkaus aktivoi funktion joka vertaa aikaa kello yhdeksään, ja antaa ilmoituksen riippuen onko työläinen ajoissa, myöhässä vai jo kirjautunut sisään.
Viestissä lukee myös kokonais myöhästymis aika.

Ylhäällä on satunnaisesti vedetty "inspirational quote" ZenQuotes.io API:sta, joka vaihtuu joko applikaation resetattaessa, taikka kerran päivässä.
Back-up quote löytyy, sekä myös error quote mikäli quote-backend server ei käynnissä taikka ei saavutettavissa.

Taustalla quote-backend server.js hoitaa quotejen fetchaamisen ZenQuotesista, ja näyttää sen applikaation yläreunassa, mikäli mahdollista.

Kirjautumistiedot, aika muutokset ja muut data tallentuu Firebase/Firestore databaseen.
Kerätyt tiedot: "name", "isLoggedIn", "isLate", "totalMinutesLate", "lastLogin"

Admin Panel:
Ei tarkoitettu normaali käyttäjän nähtäväksi.

Admin panelista voi:
Lisätä työläisiä
Muokata työläisen nimeä sekä kokonais myöhästymistä
Kirjata yksilön, sekä kaikki käyttäjät ulos
Arkistoida yksilön (siirtää työläisen+datan toiseen Firestore kansioon)
Admin panelin pohjalla on arkisto, josta voi palauttaa arkistoituja työläisiä tarvittaessa.

**HUOM**
Arkistossa pitää olla väh. yksi "dummy" käyttäjä, muuten kansiorakenne ei välttämättä toimi oikein
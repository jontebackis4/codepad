<!-- markdownlint-disable MD033 - this disables varnings in visual studio code -->

# INSTRUKTIONER

## Hur skapas godisar?

Om vi vill att datorn ska hoppa över en kod-rad kan vi göra om den till en kommentar. Det gör vi genom att skriva två bindestreck i början av raden (`--`).

**Uppgift 1:**

* Testa att göra rad 3 i `candy_factory.script` till en kommentar.
* Starta om spelet.
* Vad händer?

<details>
<summary>
<b>Läs svar</b>
</summary>

> Varje gång spelet startas så kommer koden inuti `init` att köras en gång.<br><br>
Om vi kommenterar bort `create_candy()` så kommer den första godisen aldrig att skapas när spelet startar.
</details>

**Uppgift 2:**

* Ta bort bindestrecken på rad 3 i `candy_factory.script`.
* Testa att göra rad 8 i `candy_factory.script` till en kommentar.
* Vad händer nu?

<details>
<summary>
<b>Läs svar</b>
</summary>

> Varje gång en godis krossas så kommer en ny att skapas.<br><br>
Om vi kommenterar bort `create_candy()` så kommer det aldrig att skapas någon ny godis efter att vi krossat den första.
</details>

------------------------------------------------------------

## Var skapas godisar?

Just nu skapas godisar på samma ställe hela tiden. I `candy_factory.script` kan du se att godisens **x-position är 500** och **y-positionen är 250** när den skapas. Om x-positionen är **högre än 500** kommer godisen att placeras längre åt **höger**. Om x-positionen är **mindre än 500** kommer godisen att placeras längre åt **vänster**. Godisens y-position styr om godisen är uppe eller nere i bilden.

![Bild på koordinatsystem](https://i.gyazo.com/0688fba747933d69b66205e460a4f1e5.png "Koordinatsystem")

**Uppgift 3:**

* Testa att ändra värdet på godisens x-position och y-position (i `candy_factory.script`) så att den skapas på någon annan plats.
* Kan man skriva in ett värde så att godisen placeras utanför bilden?

Vi vill nu att godisarna ska hamna på olika ställen varje gång. Då behöver vi lära oss att använda `random()` för att få fram slumptal.

**Uppgift 4:**

* Testa att ändra så att x-positionen slumpas fram med hjälp av `random()`. Du kan göra det genom att använda koden nedan:

  ```
  position.x = math.random(0, 1000)
  ```

  X-positionen kommer då att bli ett slumpat tal mellan **0** och **1000**.
* Gör likadant för y-positionen.
* Testa att ändra på värdena **0** och **1000** så att godisarna hamnar där du vill.

------------------------------------------------------------

## Hur många poäng får man?

Gör så att man får olika många poäng om man krossar en godis.

1. Testa att ändra rad 5 i `points.gui_script` så att man får två poäng för varje godis.
2. Ändra så att man får dubbelt så många poäng varje gång (använd `*` för multiplikation).
3. Testa att ändra texten på rad 6.
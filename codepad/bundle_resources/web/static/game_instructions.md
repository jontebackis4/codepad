<!-- markdownlint-disable MD033 - this disables varnings in visual studio code -->

# INSTRUKTIONER

## Hur skapas godisar?

Om vi vill att datorn ska hoppa över en kod-rad kan vi göra om den till en kommentar. Det gör vi genom att skriva två bindestreck (`--`) i början av raden.

**Uppgift 1:**

* Testa att göra rad 4 i `candy_factory.script` till en kommentar.
* Starta om spelet genom att trycka på **restart**.
* Vad händer?

    <details>
    <summary>
    <b>Läs svar</b>
    </summary>

    > Varje gång spelet startas så kommer koden inuti `init` att köras en gång.
    > 
    > Om vi kommenterar bort `create_candy()` så kommer den första godisen aldrig att skapas när spelet startar.
    </details>

**Uppgift 2:**

* Ta bort bindestrecken på rad 4 i `candy_factory.script`.
* Testa att göra rad 9 i `candy_factory.script` till en kommentar.
* Vad händer nu?

    <details>
    <summary>
    <b>Läs svar</b>
    </summary>

    > Varje gång en godis krossas så kommer en ny att skapas.
    > 
    > Om vi kommenterar bort `create_candy()` så kommer det aldrig att skapas någon ny godis efter att vi krossat den första.
    </details>

------------------------------------------------------------

## Var skapas godisar?

Just nu skapas godisar på samma ställe hela tiden. I `candy_factory.script` kan du se att godisens **x-position är 600** och **y-positionen är 300** när den skapas. Om x-positionen är **högre än 600** kommer godisen att placeras längre åt **höger**. Om x-positionen är **mindre än 600** kommer godisen att placeras längre åt **vänster**. Godisens y-position styr hur högt eller lågt godisen placeras.

![Bild på koordinatsystem](https://i.gyazo.com/0688fba747933d69b66205e460a4f1e5.png "Koordinatsystem")

**Uppgift 3:**

* Testa att ändra värdet på godisens x-position och y-position (i `candy_factory.script`) så att den skapas på någon annan plats. Varje gång du ändrat värdet så klickar du på `restart` för att köra den nya koden.
* Kan du skriva in ett värde så att godisen placeras utanför bilden?

Vi vill nu att godisarna ska hamna på olika ställen varje gång. Då behöver vi lära oss att använda `math.random()` för att få fram slumptal.

**Uppgift 4:**

* Testa att ändra så att x-positionen slumpas fram med hjälp av `math.random()`. Du kan göra det genom att använda koden nedan:

  ```
  position.x = math.random(0, 1000)
  ```

  X-positionen kommer då att bli ett slumpat tal mellan **0** och **1000**.
* Gör likadant för y-positionen.
* Testa att ändra på värdena **0** och **1000** så att godisarna inte hamnar utanför kanten.

------------------------------------------------------------

## Hur många poäng får du?

När vi startar spelet så har du 0 poäng.

**Uppgift 5:**

* Testa att ändra rad 1 i `points.gui_script` så att du startar med mer än 0 poäng.
* Är det möjligt att starta med mindre än 0 poäng?

Varje gång du krossar en godis så får du ett poäng. Nu vill vi ändra så att du kan få olika många poäng.

**Uppgift 6:**

* Testa att ändra rad 5 i `points.gui_script` så att du får två poäng för varje godis du krossar.
* Ändra så att du får dubbelt så många poäng varje gång (använd `*` för att göra multiplikation).

Så på rad 5 i `points.gui_script` uppdateras hur många poäng du har. På rad 6 i `points.gui_script` ändras texten som syns i spelet. Texten som syns är en sammanslagning av strängen `"Points: "` och variabeln `points` som håller koll på hur många poäng vi har.

<details>
<summary>
<b>Läs mer om strängar</b>
</summary>

> För datorn är det skillnad på texter och tal. Som vi sett är det inget konstigt när vi ska använda tal utan det går bra att skriva exempelvis 
> ```
> x = 5
> y = 3958
> ```
> Texter är lite speciella. För att datorn ska veta var som är texter måste vi använda citationstecken ("") runt texten, exempelvis 
> ```
> text = "Hej på dig"
> namn = "Nicolina"
> ```
> I programmering brukar texter kallas för **strängar**.<br><br>
> Om vi vill lägga ihop två strängar så använder vi två punkter (..). Exempelvis
> ```
> text = "My name is " .. "Jeff"
> ```
> Då lägger datorn ihop strängarna så att de blir en sträng. Två punkter kan vi också använda för att lägga ihop en sträng och en siffra.
</details>

**Uppgift 7:**

* Testa att ändra texten på rad 6 i `points.gui_script` så att det blir en annan text på skärmen.
* Testa att sätta citationstecken runt `points` så att det blir
  ```
  text = "Points: " .. "points"
  ```
* Vad händer och varför?

    <details>
    <summary>
    <b>Läs svar</b>
    </summary>

    > Om vi använder koden
    > ```
    > text = "Points: " .. "points"
    > ```
    > så kommer datorn lägga ihop de två texterna och visa dem på skärmen.
    > 
    > Om vi istället använder koden
    > ```
    > text = "Points: " .. points
    > ```
    > så kommer datorn lägga ihop texten `"Points: "` med hur många poäng du har och visa det på skärmen. Om vi använder citationstecken så är det en text och annars är det en variabel.
    </details>

**Uppgift 8:**

* Ändra så att slumpen bestämmer hur många poäng du får. Använd `math.random()` som när vi placerade godisarna.  
  
    
      
        
        

------------------------------------------------------------  

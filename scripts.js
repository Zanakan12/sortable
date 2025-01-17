// Charger le fichier JSON avec fetch
fetch('./all.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du fichier JSON.');
    }
    return response.json(); // Parser le JSON
  })
  .then((data) => {
    loadData(data); // Appeler la fonction pour afficher les héros
  })
  .catch((error) => {
    console.error('Erreur :', error);
  });

// Fonction pour formater les powerstats sans accolades
const formatPowerstats = (powerstats) => {
  return Object.entries(powerstats || {}) // Gérer les valeurs nulles
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
};

// Fonction principale pour charger les données des héros
const loadData = (heroes) => {
  // Construire les lignes du tableau
  const heroesRows = heroes.map(hero => `
      <tr>
          <td><img src="${hero.images?.xs || 'https://via.placeholder.com/50'}" alt="${hero.name}" width="50"></td>
          <td>${hero.name || "N/A"}</td>
          <td>${hero.biography?.fullName || "N/A"}</td>
          <td>${formatPowerstats(hero.powerstats) || "N/A"}</td>
          <td>${hero.appearance?.race || "N/A"}</td>
          <td>${hero.appearance?.gender || "N/A"}</td>
          <td>${hero.appearance?.height?.join(", ") || "N/A"}</td>
          <td>${hero.appearance.weight.join(", ") || "N/A"}</td>
          <td>${hero.biography?.placeOfBirth || "N/A"}</td>
          <td>${hero.biography?.alignment || "N/A"}</td>
      </tr>
  `).join("");

  // Construire la structure du tableau avec les lignes
  const heroesTable = `
      <table border="1" align="center">
          <thead>
              <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Full Name</th>
                  <th>Powerstats</th>
                  <th>Race</th>
                  <th>Gender</th>
                  <th>Height</th>
                  <th>Weight</th>
                  <th>Place Of Birth</th>
                  <th>Alignment</th>
              </tr>
          </thead>
          <tbody align="center">
              ${heroesRows}
          </tbody>
      </table>
  `;
  const searchBar =`<input type="text" id="searchBar placeholder="Search... onkeyup="searchFunction()">`

  // Insérer le tableau dans la page
  document.getElementById("searchBar").innerHTML = searchBar
  document.getElementById("allHeroes").innerHTML = heroesTable;
};


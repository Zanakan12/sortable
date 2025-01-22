class HeroTable {
  constructor() {
    // État initial de la classe
    this.data = []; // Contient les données des héros
    this.filteredData = []; // Contient les données filtrées en fonction de la recherche
    this.currentPage = 1; // Page actuelle pour la pagination
    this.pageSize = 20; // Nombre d'éléments par page
    this.sortColumn = "name"; // Colonne utilisée pour le tri
    this.sortDirection = "asc"; // Direction du tri (ascendant ou descendant)
    this.searchTerm = ""; // Terme de recherche

    // Sélection des éléments DOM pour l'interaction
    this.tableBody = document.querySelector("tbody"); // Corps du tableau pour afficher les héros
    this.pageSizeSelect = document.querySelector("#pageSize"); // Sélecteur de taille de page
    this.searchInput = document.querySelector("#search"); // Champ de recherche
    this.paginationContainer = document.querySelector("#pagination"); // Conteneur de pagination

    // Initialisation de la classe
    this.init();
  }

  // Fonction d'initialisation, qui charge les données et configure les événements
  async init() {
    console.log("Initialisation...");
    await this.fetchData(); // Charge les données des héros
    this.dataFormat();
    this.setupEventListeners(); // Configure les écouteurs d'événements
    this.render(); // Affiche les données
  }
  dataFormat() {
    this.filteredData.forEach((hero) => {
      hero.biography.placeOfBirth = hero.biography.placeOfBirth.replace(
        /[()]/g,
        ""
      );
      hero.biography.placeOfBirth = hero.biography.placeOfBirth.replace(
        /[;]/g,
        ", "
      );

      for (let weight of hero.appearance.weight) {
        if (weight.split(" ")[0] === "-") {
          hero.appearance.weight[0] = "-";
          hero.appearance.weight[1] = "-";
        }
      }

      for (let height of hero.appearance.height) {
        if (height[0] === "-") {
          hero.appearance.height[0] = "-";
          hero.appearance.height[1] = "-";
        }
      }
    });
  }

  // Fonction qui applique l'opérateur de recherche à un héros
  applySearchOperator(hero, searchTerm) {
    const operators = [
      "include", // Inclut un terme
      "exclude", // Exclut un terme
      "equal", // Égal à une valeur
      "not equal", // Différent d'une valeur
      "greater than", // Plus grand qu'une valeur
      "less than", // Moins que une valeur
    ];

    let operator = null;
    let value = searchTerm;

    // Recherche d'un opérateur dans le terme de recherche
    for (const op of operators) {
      if (searchTerm.includes(op)) {
        operator = op; // Définit l'opérateur trouvé
        value = searchTerm.split(op)[1].trim(); // Récupère la valeur après l'opérateur
        break;
      }
    }

    // Fonction helper pour vérifier si une valeur contient le terme recherché
    const checkValue = (fieldValue) => {
      if (fieldValue === null || fieldValue === undefined) return false;
      return String(fieldValue).toLowerCase().includes(value.toLowerCase());
    };

    // Fonction de recherche récursive dans un objet
    const searchInObject = (obj) => {
      return Object.values(obj).some((field) => {
        if (typeof field === "object" && field !== null) {
          return searchInObject(field); // Recherche récursive dans les objets imbriqués
        }
        return checkValue(field); // Recherche dans les valeurs simples
      });
    };

    // Applique l'opérateur de recherche sur les héros
    switch (operator) {
      case "include":
        return searchInObject(hero);
      case "exclude":
        return !searchInObject(hero);
      case "equal":
        return Object.values(hero).some(
          (field) => String(field).toLowerCase() === value.toLowerCase()
        );
      case "not equal":
        return !Object.values(hero).some(
          (field) => String(field).toLowerCase() === value.toLowerCase()
        );
      case "greater than":
        return hero.powerstats.strength > parseInt(value, 10); // Comparaison de force
      case "less than":
        return hero.powerstats.strength < parseInt(value, 10); // Comparaison de force
      default:
        return searchInObject(hero); // Recherche par défaut
    }
  }

  handleSort(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }

    this.filteredData.sort((a, b) => {
      let valueA = this.getValueByColumn(a, column);
      let valueB = this.getValueByColumn(b, column);
      if (
        valueA === "" ||
        valueA == "-" ||
        valueA === null ||
        valueA === undefined
      )
        return 1;
      if (
        valueB === "" ||
        valueB === "-" ||
        valueB === null ||
        valueB === undefined
      )
        return -1;
      // Gestion spécifique pour les poids
      if (["weight", "height"].includes(column)) {
        const unitOrder = column === "weight" ? ["kg", "tons"] : ["cm", "meters"];
        const unitA = this.getUnit(valueA);
        const unitB = this.getUnit(valueB);
        const numericValueA = this.extractNumericValue(valueA);
        const numericValueB = this.extractNumericValue(valueB);
      
        // Priorité des unités
        if (unitA !== unitB) {
          return unitOrder.indexOf(unitA) < unitOrder.indexOf(unitB)
            ? this.sortDirection === "asc" ? -1 : 1
            : this.sortDirection === "asc" ? 1 : -1;
        }
      
        // Comparer les valeurs numériques
        return this.sortDirection === "asc"
          ? numericValueA - numericValueB
          : numericValueB - numericValueA;
      }
      

      // Tri standard pour les autres colonnes
      valueA = String(valueA).trim().toLowerCase();
      valueB = String(valueB).trim().toLowerCase();
      if (valueA < valueB) return this.sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    this.updateSortIcons(column);
    this.render();
  }
  extractNumericValue(weight) {
    console.log(weight,"hhhh")
    if (!weight || weight === "-") return 0; // Si le poids est manquant, retourne 0
    const match = weight.match(/\d+(\.\d+)?/); // Extrait le nombre
    return match ? parseFloat(match[0]) : 0; // Convertit en nombre
  }

  getUnit(value) {
    if (!value || value === "-" || value === null || value === undefined) return ""; // Aucun poids/hauteur
    const lowerValue = String(value).toLowerCase();
    if (lowerValue.includes("tons")) return "tons";
    if (lowerValue.includes("kg")) return "kg";
    if (lowerValue.includes("cm")) return "cm";
    if (lowerValue.includes("meters")) return "meters";
    return ""; // Unité inconnue
  }
  

  // Fonction pour mettre à jour les icônes de tri dans les en-têtes de colonnes
  updateSortIcons(column) {
    document.querySelectorAll("th").forEach((header) => {
      const headerColumn = header.dataset.column;
      if (headerColumn === column) {
        // Affiche l'icône de tri sur la colonne triée
        header.innerHTML = `${header.dataset.label} ${
          this.sortDirection === "asc" ? "▲" : "▼"
        }`;
      } else {
        header.innerHTML = header.dataset.label; // Réinitialise les autres colonnes
      }
    });
  }

  // Fonction pour obtenir la valeur d'une colonne donnée
  getValueByColumn(hero, column) {
    const value = (column) => {
      switch (column) {
        case "name":
          return hero.name;
        case "fullName":
          return hero.biography.fullName;
        case "race":
          return hero.appearance.race;
        case "gender":
          return hero.appearance.gender;
        case "height":
          return hero.appearance.height[1];
        case "weight":
          return hero.appearance.weight[1];
        case "placeOfBirth":
          return hero.biography.placeOfBirth;
        case "alignment":
          return hero.biography.alignment;
        default:
          return undefined; // Valeur par défaut pour les colonnes inconnues
      }
    };

    const fieldValue = value(column);
    // Si la valeur est null ou undefined, on retourne une valeur spéciale.
    return fieldValue === null || fieldValue === undefined
      ? ""
      : fieldValue;
  }

  // Fonction asynchrone pour charger les données depuis une API
  async fetchData() {
    try {
      console.log("Fetching data...");
      const response = await fetch(
        "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json"
      );
      this.data = await response.json(); // Stocke les données dans this.data
      this.filteredData = [...this.data]; // Copie des données dans filteredData pour la recherche
      console.log("Data loaded:", this.data.length);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error); // Gestion des erreurs
    }
  }

  // Fonction pour afficher les héros dans le tableau
  render() {
    const paginatedData = this.getPaginatedData(); // Récupère les données paginées
    this.tableBody.innerHTML = ""; // Vide le corps du tableau

    // Pour chaque héros, crée une ligne dans le tableau
    paginatedData.forEach((hero) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><img src="${hero.images.xs}" alt="${hero.name}"></td>
                <td>${hero.name}</td>
                <td>${hero.biography.fullName || "-"}</td>
                <td>${this.formatPowerstats(hero.powerstats)}</td>
                <td>${hero.appearance.race || "-"}</td>
                <td>${hero.appearance.gender || "-"}</td>
                <td>${hero.appearance.height[1] || "-"}</td>
                <td>${hero.appearance.weight[1] || "-"}</td>
                <td>${hero.biography.placeOfBirth || "-"}</td>
                <td>${hero.biography.alignment || "-"}</td>
            `;
      this.tableBody.appendChild(row); // Ajoute la ligne au tableau
    });

    this.renderPagination(); // Rendre les boutons de pagination
  }

  // Fonction pour afficher les détails d'un héros sélectionné
  showHeroDetails(hero) {
    const detailsContainer = document.querySelector("#hero-details");
    detailsContainer.innerHTML = `
    <h2>${hero.name}</h2>
    <img src="${hero.images.lg}" alt="${hero.name}">
    <p><strong>Full Name:</strong> ${hero.biography.fullName || "-"}</p>
    <p><strong>Race:</strong> ${hero.appearance.race || "-"}</p>
    <p><strong>Gender:</strong> ${hero.appearance.gender || "-"}</p>
    <p><strong>Height:</strong> ${hero.appearance.height[1] || "-"}</p>
    <p><strong>Weight:</strong> ${hero.appearance.weight[1] || "-"}</p>
    <p><strong>Place of Birth:</strong> ${
      hero.biography.placeOfBirth || "-"
    }</p>
    <p><strong>Alignment:</strong> ${hero.biography.alignment || "-"}</p>
    <p><strong>Powerstats:</strong><br>${this.formatPowerstats(
      hero.powerstats
    )}</p>
  `;
  }

  // Function to set up event listeners
  setupEventListeners() {
    // Event listener for the search input
    this.searchInput.addEventListener("input", () => {
      this.handleSearch();
    });

    // Event listener for the page size select
    this.pageSizeSelect.addEventListener("change", () => {
      this.pageSize =
        this.pageSizeSelect.value === "all"
          ? "all"
          : parseInt(this.pageSizeSelect.value);
      this.currentPage = 1;
      this.render();
    });

    // Event listeners for sorting columns
    document.querySelectorAll("th").forEach((header) => {
      header.addEventListener("click", () => {
        const column = header.dataset.column;
        this.handleSort(column);
      });
    });

    // Event listeners for each hero row
    this.tableBody.addEventListener("click", (event) => {
      const row = event.target.closest("tr");
      if (row) {
        const heroName = row.querySelector("td:nth-child(2)").textContent;
        const hero = this.data.find((h) => h.name === heroName);
        if (hero) {
          this.showHeroDetails(hero);
        }
      }
    });
  }

  // Function to handle the search input
  handleSearch() {
    const searchTerm = this.searchInput.value.toLowerCase().trim();
    if (searchTerm) {
      this.filteredData = this.data.filter((hero) =>
        this.applySearchOperator(hero, searchTerm)
      );
    } else {
      this.filteredData = this.data;
    }
    this.currentPage = 1;
    this.render();

    // Update the URL with the search term
    const url = new URL(window.location);
    url.searchParams.set("search", searchTerm);
    history.pushState(null, null, url);
  }

  // Fonction pour récupérer les données paginées
  getPaginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end =
      this.pageSize === "all"
        ? this.filteredData.length // Si "all", n'applique pas de limite
        : start + this.pageSize; // Sinon, affiche la page suivante
    return this.filteredData.slice(start, end); // Récupère les données pour la page actuelle
  }

  // Fonction pour formater les powerstats d'un héros
  formatPowerstats(powerstats) {
    return Object.entries(powerstats)
      .map(([key, value]) => `${key}: ${value}`)
      .join("<br>"); // Affiche chaque powerstat sur une nouvelle ligne
  }

  // Fonction pour afficher les boutons de pagination
  renderPagination() {
    const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.currentPage = Math.max(1, Math.min(this.currentPage, totalPages)); // Limite de la page actuelle

    this.paginationContainer.innerHTML = "";

    // Bouton "Précédent"
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = this.currentPage === 1;
    prevButton.addEventListener("click", () => {
      this.currentPage--;
      this.render();
    });

    // Bouton "Suivant"
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = this.currentPage === totalPages;
    nextButton.addEventListener("click", () => {
      this.currentPage++;
      this.render();
    });

    // Ajout des boutons à la pagination
    this.paginationContainer.appendChild(prevButton);
    const pageIndicator = document.createElement("span");
    pageIndicator.textContent = ` Page ${this.currentPage} of ${totalPages} `;
    this.paginationContainer.appendChild(pageIndicator);
    this.paginationContainer.appendChild(nextButton);
  }
}

// Initialisation de l'application lorsque le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  new HeroTable(); // Crée une instance de HeroTable
});

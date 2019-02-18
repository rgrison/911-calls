# 911 Calls avec ElasticSearch

## Import du jeu de données

Pour importer le jeu de données, complétez le script `import.js` (ici aussi, cherchez le `TODO` dans le code :wink:).

Exécutez-le ensuite :

```bash
npm install
node import.js
```

Vérifiez que les données ont été importées correctement grâce au shell (le nombre total de documents doit être `153194`) :

```
GET <nom de votre index>/_count
```

## Requêtes

À vous de jouer ! Écrivez les requêtes ElasticSearch permettant de résoudre les problèmes posés.

```
GET 911/_search
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "geo_distance": {
          "distance": "500m",
          "location": {
            "lat": 40.241493,
            "lon": -75.283783
          }
        }
      }
    }
  }
}

GET 911/_search
{
  "size": 0,
  "aggs" : {
    "callCategories" : {
      "filters" : {
        "filters" : {
          "EMS" :   { "match" : { "title" : "EMS:"   }},
          "Fire" : { "match" : { "title" : "Fire:" }},
          "Traffic" : { "match" : { "title" : "Traffic:" }}
        }
      }
    }
  }
}

GET 911/_search
{
  "size": 0,
  "aggs": {
    "by_month": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "month"
      },
      "aggs": {
        "month_bucket_sort": {
          "bucket_sort": {
            "sort": {"_count": "desc"},
            "size": 3
          }
        }
      }
    }
  }
}

GET 911/_search
{
  "size": 0,
  "query": {
    "bool": {
      "must": {
        "match": {"title": "OVERDOSE"}
      }
    }
  },
  "aggs" : {
    "city" : {
      "terms" : { 
        "field" : "twp.keyword",
        "size" : 3
      }
    }
  }
}
```

## Kibana

Dans Kibana, créez un dashboard qui permet de visualiser :

* Une carte de l'ensemble des appels
* Un histogramme des appels répartis par catégories
* Un Pie chart réparti par bimestre, par catégories et par canton (township)

Pour nous permettre d'évaluer votre travail, ajoutez une capture d'écran du dashboard dans ce répertoire [images](images).

### Timelion
Timelion est un outil de visualisation des timeseries accessible via Kibana à l'aide du bouton : ![](images/timelion.png)

Réalisez le diagramme suivant :
![](images/timelion-chart.png)

Envoyer la réponse sous la forme de la requête Timelion ci-dessous:  

```
TODO : ajouter la requête Timelion ici
```

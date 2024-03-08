# running-calculator-vue

Application for monitoring statistics and planning runs.

## Demo

[https://kwiatkowski.co/training/](https://kwiatkowski.co/training/)

## Project setup
Copy .dev
```
cp .env.example .env
```

Set your variables
```
VUE_APP_TITLE='title'
VUE_APP_DESCRIPTION='description'
VUE_APP_FAVICON='https://vuejs.org/logo.svg'
VUE_APP_GTM=''
VUE_APP_API='https://example.com/wp-json/wp/v2/'
```

The application needs two endpoints to work. The first one is for downloading the training list and the second one is for downloading statistics for shoes.

I have created a plugin for Wordpress that creates Post Type "training" and Taxonomies "training_shoes". The plugin is available in the repository:

[https://github.com/kwiatkowski/wp-plugin-training](https://github.com/kwiatkowski/wp-plugin-training)

Training list expects an array of objects with properties:
``` 
/wp-json/wp/v2/training?per_page=99999&orderby=date&order=desc
``` 

``` 
[
    {
        "id": 28183,
        "date": "2024-03-04T00:00:06",
        "acf": {
            "type": "verification",
            "shoe": 2,
            "distance": 10010,
            "duration": "00:44:21",
            "stride_length": 149,
            "average_heart_rate": 155,
            "v02max": 52
        },
    },
    ...
]
```

The shoe statistics list expects an array of objects with properties:

``` 
/wp-json/wp/v2/training_shoes
``` 

``` 
[
    {
        "id": 2,
        "count": 70,
        "description": "",
        "name": "Nike Zoom Pegasus 37",
        "slug": "nike_pegasus_37",
    },
    ...
]
``` 

```
yarn install
```

### Compiles and hot-reloads for development
```
yarn dev
```

### Compiles and minifies for production
```
yarn build
```

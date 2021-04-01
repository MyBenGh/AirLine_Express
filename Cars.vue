<template>
    <div>

      <h1>Ingrédients pour le gateau</h1>
      <br>
      <img :src="'/static/Images/download.jpg'" id=img1>
      <img :src="'/static/Images/download1.jpg'" id=img2>
      <img :src="'/static/Images/download2.jpg'" id=img3>
      <br>
      <ul>
          <li>{{ ingredientsG.un }}</li>
          <li>{{ ingredientsG.deux }}</li>
          <li>{{ ingredientsG.trois }}</li>
          <li>{{ ingredientsG.quatre }}</li>
          <li>{{ ingredientsG.cinq }}</li>
          <li>{{ ingredientsG.six }}</li>
          <li>{{ ingredientsG.sept }}</li>
          <li>{{ ingredientsG.huit }}</li>
          <li>{{ ingredientsG.neuf }}</li>
          <li>{{ ingredientsG.dix }}</li>
      </ul>
      <br>
      <h1>Ingrédients pour la creme de beurre</h1>
      <br>
      <img :src="'/static/Images/download3.jpg'" id=img4>
      <img :src="'/static/Images/download4.jpg'" id=img5>
      <img :src="'/static/Images/download5.jpg'" id=img6>
      <br>
      <ul>
          <li>{{ ingredientsG.onze }}</li>
          <li>{{ ingredientsG.douze }}</li>
          <li>{{ ingredientsG.treize }}</li>
          <li>{{ ingredientsG.quatorze }}</li>
          <li>{{ ingredientsG.quinze }}</li>
          <li>{{ ingredientsG.seize }}</li>
      </ul>
      <br>
      <br>
      <br>
    </div> 
</template>

<script>
export default {
    data () {
        return{
            ingredientsG: {
              un: '1 2/3 tasse de farine tout usage',
              deux: '1 tasse de sucre granulé',
              trois: '1 tasse de sucre granulé',
              quatre: '1 1/2 c. à thé de levure chimique  ',
              cinq: '1/2 c. à thé de sel',
              six: '3/4 tasse de beurre non salé, à température ambiante ou partiellement fondu  ',
              sept: '3 blancs d œufs, à température ambiante',
              huit: '1 c. à soupe d extrait de vanille pure',
              neuf: '1/2 tasse de crème sure, à température ambiante',
              dix: '1/2 tasse de lait, à température ambiante',
              onze: '1 lb de sucre à glacer',
              douze: '1 tasse de beurre non salé',
              treize: '1/4 tasse de crème fraîche ou de lait',
              quatorze:'1 c. à thé d extrait de vanille',
              quinze:'1 pincée de sel, au goût',
              seize: 'Colorant alimentaire  '
            }
        }    
    }
}
</script>

<style>
p{
  background-color: bisque;
}
h1{
  text-align: center;
  color: darkred;
  background-color: lightgray;
}
ul{
  text-align: left;
  margin-left: 35%;
  color: balck;
}
#img1{
  float: right;
  width: 350px;
  height: 250px;
  border-radius: 50%;
}
#img2{
  float: left;
  width: 350px;
  height: 250px;
  border-radius: 50%;
}
#img3{
  float: center;
  width: 350px;
  height: 250px;
  border-radius: 50%;
}
#img4{
  float: center;
  width: 350px;
  height: 250px;
  border-radius: 50%;
}
#img5{
  float: center;
  width: 350px;
  height: 250px;
  border-radius: 50%;
}
#img6{
  float: center;
  width: 350px;
  height: 250px;
  border-radius: 50%;
}
</style>
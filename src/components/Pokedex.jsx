import React from 'react';
import {AppBar, Toolbar, Grid, Card, CardContent, CircularProgress, CardMedia, Typography, TextField} from "@material-ui/core"
import { makeStyles, fade } from '@material-ui/core/styles';
import axios from "axios"
import { useState } from 'react';
import { useEffect } from 'react';
import SearchIcon from "@material-ui/icons/Search"
import { toFirstCharUpperCase } from "../utils/constants";

const useStyles = makeStyles(theme => ({
    pokedexContainer: {
        paddingTop:'20px',
        paddingLeft:'50px',
        paddingRight: '50px'
    },
    cardMedia: {
        margin : "auto"
    },
    cardContent : {
        textAlign:"center"
    },
    searchContainer: {
        display:`flex`,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        paddingLeft: "20px",
        paddingRight: "20px",
        marginTop: "5px",
        marginBottom: "5px"
    },
    searchIcon: {
        alignSelf:"flex-end",
        marginBottom: "5px"
    },
    searchInput: {
        width: "200px",
        margin: "5px",
    }
}))



const Pokedex = (props) => {

    const {history} = props
    const [pokemonData,setPokemonData] = useState()
    const [filter,setFilter] = useState("")

    const classes = useStyles()

    const handleSearchChange = (e) => {
        setFilter(e.target.value)
    } 
    useEffect(() => {
        axios
            .get("https://pokeapi.co/api/v2/pokemon?limit=807")
            .then(response => {
                const {data} = response
                const {results} = data
                const newPokemonData = {}
                results.forEach((pokemon,index) => {
                    newPokemonData[index+1] = {
                        id: index+1,
                        name: pokemon.name,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${index+1}.png`
                    }
                })
                setPokemonData(newPokemonData)
            })
    },[])

    const getPokemonCard = (pokemonId) => {
        console.log(pokemonData[`${pokemonId}`]);
        const {id,name,sprite} = pokemonData[pokemonId]
        return(
            <Grid item xs={12} sm={6} md={4} key={pokemonId}>
            <Card onClick = {() => history.push(`/${id}`)}>
               <CardMedia 
               className = {classes.cardMedia}
               image={sprite}
               style = {{width:"130px", height:"130px"}}
               />
               <CardContent className={classes.cardContent}>
                   <Typography>
                       {`${id}. ${toFirstCharUpperCase(name)}`}
                   </Typography>
               </CardContent>
            </Card>
            </Grid>
        )
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <div className={classes.searchContainer}>
                        <SearchIcon className = {classes.searchIcon}/>
                        <TextField onChange={handleSearchChange} label="pokemon" variant="standard" className={classes.searchInput}/>
                    </div>
                </Toolbar>
            </AppBar>
            {pokemonData? (
                <Grid container spacing={2} className={classes.pokedexContainer}>
                    {Object.keys(pokemonData).map(
                        (pokemonId) => 
                        pokemonData[pokemonId].name.includes(filter)&&
                        getPokemonCard(pokemonId)
                    )}
                </Grid>
            ) : <CircularProgress/>
            }
            
        </>
    );
};

export default Pokedex;

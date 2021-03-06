/**
 * Created by user on 10/10/17.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
import SwipeCards from './SwipeCards';
import HttpUtils from '../../http/HttpUtils';
import {getRandomGirl} from '../../http/GankIoApis';
import ActionUtils from "../../utils/ActionUtils";
import {FLAG_STORAGE} from "../../dao/FavoriteDao";
import FavoriteDao from "../../dao/FavoriteDao";

export const MARGINX = 0.06;
export const MARGINY = 0.2;
const {width, height} = Dimensions.get('window');

class Card extends Component {
    render() {
        return (
            <View
                style={styles.card}
                shadowColor={'#222'}
                shadowOffset={{width: 0, height: 0}}
                shadowRadius={4}
                shadowOpacity={0.4}
            >
                <Image source={{uri: this.props.url}} style={styles.img}/>
            </View>
        )
    }
};

class NoMoreCards extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={styles.noMoreCardsText}>No more cards</Text>
            </View>
        )
    }
}

var results = [];
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_pic);
export default class HappyPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
        };
        this.sendRequest = this.sendRequest.bind(this);
    }

    componentWillMount() {
        this.sendRequest(2);
    }

    sendRequest(num) {
        const getDailyUrl = getRandomGirl(num);
        console.log(getDailyUrl);
        HttpUtils.get(getDailyUrl)
            .then((json) => {
                this.setState({
                    cards: concat(results, json.results)
                });
                if (json.results.length > 1) {
                    results.push(json.results[1])
                } else {
                    results = json.results;
                }

            })
            .catch((error) => {
                this.setState({});
            });

    }


    handleYup(card) {
        remove(results, card);
        this.sendRequest(1);
        ActionUtils.onFavorite(favoriteDao, card, true, FLAG_STORAGE.flag_pic)
    }

    handleNope(card) {
        remove(results, card);
        this.sendRequest(1);
    }

    render() {
        // If you want a stack of cards instead of one-per-one view, activate stack mode
        // stack={true}
        return (
            <SwipeCards
                cards={this.state.cards}
                stack={true}
                renderCard={(cardData) => <Card {...cardData}/>}
                renderNoMoreCards={() => <NoMoreCards/>}
                handleYup={this.handleYup.bind(this)}
                handleNope={this.handleNope.bind(this)}
                cardRemoved={this.cardRemoved}
                stackOffsetX={30}
            />
        )
    }
}

function concat(arr1, arr2) {
    var newArr = arr1.slice(0);
    for (var i = 0; i < arr2.length; i++) {
        newArr.push(arr2[i]);
    }
    return newArr;
}

function remove(arr, item) {
    var newarr = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != item) {
            newarr.push(arr[i]);
        }
    }
    return newarr;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
    },
    card: {
        padding: 10,
        width: width * (1.0 - MARGINX * 2)-50,
        height: height * (1.0 - MARGINY * 2.1),
        marginLeft: width * MARGINX,
        marginTop: height * (MARGINY-0.1),
        backgroundColor: 'white',
        borderRadius: 12

    },
    noMoreCardsText: {
        fontSize: 22,
    },
    img: {
        flex: 1,

    }
});
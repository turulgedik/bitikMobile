import React, { Component, Children } from 'react'
import {View,Text, TouchableOpacity, ScrollView, Dimensions} from 'react-native'
import {styles} from './style'

const screenWidth = Dimensions.get('window').width;

export default class Tabs extends Component {

    state={
        selectedIndex:0,
        drag:false
    }

    static Item=(props)=>{
        return(
            <View >
                
            </View>
        )
    }

    pageChange=(index)=>{
        this.setState({selectedIndex:index,drag:false},()=>{
            this.scrollView.scrollTo({x: screenWidth * index});
        })
        if(this.props.onChangeIndex!==undefined)
            this.props.onChangeIndex(index)
    }

    render() {

        const navigatorItems=Children.map(this.props.children,(child,i)=>{
            const selected=this.state.drag?false:this.state.selectedIndex===i?true:false
            return(
                <TouchableOpacity style={selected?styles.navigatorSelectedItem:styles.navigatorItem} onPress={()=>{
                    this.pageChange(i)
                }}>
                    <Text style={{color:selected?'#0A7ADD':'black',fontSize:20}}>{child.props.title}</Text>
                </TouchableOpacity>
            )
        })

        const pages=Children.map(this.props.children,child=>(
            <View style={{height:'100%',width:screenWidth}}>
                {child.props.component}
            </View>
        ))
        return (
            <View style={styles.background}>
                <View style={styles.navigator}>
                    {navigatorItems}
                </View>
                <ScrollView horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={this.props.scrollEnabled}
                    ref={node => (this.scrollView = node)}
                    onMomentumScrollEnd={elem => {
                        const info = elem.nativeEvent.contentOffset.x;
                        const index = Math.round(info / screenWidth);
                        this.pageChange(index);
                    }}
                    onScroll={() => {
                        this.setState({drag:true})
                    }}
                    scrollEventThrottle={0}>
                    {pages}
                </ScrollView>
            </View>
        )
    }
}

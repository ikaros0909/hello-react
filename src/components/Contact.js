import React from 'react';
import ContactInfo from './ContactInfo';
import ContactDetails from './ContactDetails';
import ContactCreate from './ContactCreate';

import update from 'react-addons-update';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';  //npm install react-addons-css-transition-group

//4-8 2018.06.23

export default class Contact extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            selectedKey: -1,
            keyword:'',
            contactData: [{
                name: 'Abet',
                phone: '010-0000-0001'
            }, {
                name: 'Betty',
                phone: '010-0000-0002'
            }, {
                name: 'Charlie',
                phone: '010-0000-0003'
            }, {
                name: 'David',
                phone: '010-0000-0004'
            }]
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.handleCreate = this.handleCreate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    //component가 생성되기 전 method
    componentWillMount(){ 
        const contactData = localStorage.contactData;

        if(contactData){
            this.setState({
                contactData: JSON.parse(contactData)
            })
        }
    }

    //component state가 update 될때마다 실행되는 method
    componentDidUpdate(prevProps, prevState){
        if(JSON.stringify(prevState.contactData) != JSON.stringify(this.state.contactData)){
            localStorage.contactData = JSON.stringify(this.state.contactData);
        }
    }

    handleChange(e){
        this.setState({
            keyword: e.target.value
        })
    }

    handleClick(key){
        this.setState({
            selectedKey: key
        });

        console.log(key, 'is selected');
    }

    handleCreate(contact){
        this.setState({
            contactData: update(this.state.contactData, {$push:[contact]})
        });
    }

    handleRemove(){
        if(this.state.selectedKey < 0){
            return;
        }

        this.setState({
            contactData: update(this.state.contactData,
                {$splice:[[this.state.selectedKey,1]]}
            ),
            selectedKey: -1
        });
    }

    handleEdit(name, phone){
        this.setState({
            contactData: update(this.state.contactData,
                {
                    [this.state.selectedKey]:{
                        name: {$set: name},
                        phone: {$set: phone}
                    }
                }
            )
        });
        // console.log('handleEdit!!')
    }

    render() {
        const mapToComponents = (data) => {
            data.sort();
            data = data.filter(
                (contact) => {
                    return contact.name.toLowerCase()
                        .indexOf(this.state.keyword) > -1;
                }
            )
            return data.map((contact, i) => {
                return (<ContactInfo 
                            contact={contact} 
                            key={i}
                            onClick={()=>this.handleClick(i)}
                            />);
            });
        };
        
        const transitionOptions = {
            transitionName:"fade",
            transitionEnterTimeout:500,
            transitionLeaveTimeout:500
        };

        return (
            <div>
                <h1>Contacts</h1>
                <input
                    nme="keyword"
                    placeholder="Search"
                    value={this.state.keyword}
                    onChange={this.handleChange}
                />
                <div>
                    <ReactCSSTransitionGroup {...transitionOptions}>
                    {mapToComponents(this.state.contactData)}
                    </ReactCSSTransitionGroup>
                </div>
                <ContactDetails
                    isSelected={this.state.selectedKey !== -1}
                    contact={this.state.contactData[this.state.selectedKey]}
                    onRemove={this.handleRemove}
                    onEdit={this.handleEdit}
                />
                
                <ContactCreate
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}

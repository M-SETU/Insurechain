import React, { Component } from 'react'
import { Button, Dropdown, Menu } from 'semantic-ui-react'

export default class MenuExampleSizeMini extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu size='mini'>
        <Menu.Item
          name='Admin'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='User'
          active={activeItem === 'messages'}
          onClick={this.handleItemClick}
        />

        <Menu.Menu position='right'>
       

          <Menu.Item>
            <Button primary>login</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}
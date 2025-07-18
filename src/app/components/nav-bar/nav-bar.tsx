'use client'
import YusouLogo from '@/app/components/yusou-logo/yusou-logo'
import { Burger, Container, Drawer, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import { useState } from 'react'

import classes from './navbar.module.css'

const links = [
  { link: '/upload', label: 'Upload' },
  { link: '/get', label: 'Get' },
]

function NavBar() {
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] = useDisclosure(false)
  const [opened, { toggle, close: closeBurger }] = useDisclosure(false, {
    onOpen: () => openDrawer(),
  })

  const handleClose = () => {
    closeDrawer()
    closeBurger()
  }

  const [active, setActive] = useState(links[0].link)

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={{ pathname: link.link }}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => {
        setActive(link.link)
        handleClose()
      }}
    >
      {link.label}
    </Link>
  ))
  return (
    <>
      <header className={classes.header}>
        <Container size="md" className={classes.inner}>
          <Link href="https://yusou.dev">
            <YusouLogo size={40} />
          </Link>

          <Group gap={5} visibleFrom="xs">
            {items}
          </Group>

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </Container>
      </header>
      <Drawer opened={openedDrawer} onClose={handleClose}>
        {items}
      </Drawer>
    </>
  )
}

export default NavBar

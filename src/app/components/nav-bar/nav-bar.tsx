'use client'
import YusouLogo from '@/app/components/yusou-logo/yusou-logo'
import { Burger, Container, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import { useState } from 'react'

import classes from './navbar.module.css'

const links = [
  { link: '/upload', label: 'Upload' },
  { link: '/get', label: 'Get' },
]

function NavBar() {
  const [opened, { toggle }] = useDisclosure(false)
  const [active, setActive] = useState(links[0].link)

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={{ pathname: link.link }}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => {
        setActive(link.link)
      }}
    >
      {link.label}
    </Link>
  ))
  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <YusouLogo size={40} onClick={() => window.location.href="https://yusou.vercel.dev"} />

        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  )
}

export default NavBar

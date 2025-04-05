'use client'

import YusouLogo from '@/app/components/yusou-logo/yusou-logo'
import { Burger, Container, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import { useState } from 'react'
import classes from './page.module.css'

const links = [
  { link: '/get', label: 'Get' },
  { link: '/upload', label: 'Upload' },
]

export default function Home() {
  const [opened, { toggle }] = useDisclosure(false)
  const [active, setActive] = useState(links[0].link)

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault()
        setActive(link.link)
      }}
    >
      {link.label}
    </Link>
  ))

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <YusouLogo size={40} />

        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
    // <Stack my="lg">
    //   <UploadForm />
    //   <ReceiveForm />
    // </Stack>
  )
}

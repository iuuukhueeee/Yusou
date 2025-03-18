import { Anchor, AspectRatio, Overlay } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { IconDownload } from '@tabler/icons-react'
import Image from 'next/image'

interface Props {
  objectKey: string
  presignedLink: string
}

function ImageWithLink({ objectKey, presignedLink }: Props) {
  const { hovered, ref } = useHover()

  return (
    <AspectRatio ratio={16 / 9} maw={400} mx="auto" pos="relative" ref={ref}>
      <Anchor href={presignedLink} target="_blank">
        <Image
          src={presignedLink}
          alt={objectKey}
          width={250}
          height={250}
          className="cursor-pointer"
        />
        {hovered && (
          <Overlay color="gray" backgroundOpacity={0.5} center>
            <IconDownload size={48} color="#fff" />
          </Overlay>
        )}
      </Anchor>
    </AspectRatio>
  )
}

export default ImageWithLink

'use client'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'

type MediaPickerProps = {
  memory?: {
    coverUrl: string
    content: string
    id: string
  }
}

export function MediaPicker({ memory }: MediaPickerProps) {
  const [preview, setPreview] = useState<null | string>(null)
  const [img, setImg] = useState<undefined | string>(memory?.coverUrl)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setPreview(previewURL)
    setImg('')
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        id="media"
        name="coverUrl"
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt="Preview"
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}

      {img && (
        <Image
          width={100}
          height={100}
          src={img}
          alt="Preview"
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}

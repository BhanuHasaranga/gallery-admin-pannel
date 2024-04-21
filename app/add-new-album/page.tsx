'use client'
import React from 'react'
import UploadForm from '../../components/new-album-form'
import { Navbar } from '@/components/navbar'

export default function AddNewAlbum() {
  return (
    <>
      <Navbar
        pageTitle={"Add New Album"} // Navbar component with specific props
        submitBtnTitle={"Back to Album Library"} 
        submitBtnPath="/admin-pannel" 
      />
      <div className='py-4 px-16'>
        <UploadForm/>
      </div>
    </>
  )
}

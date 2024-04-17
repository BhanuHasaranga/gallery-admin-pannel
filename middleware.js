import { NextResponse } from "next/server"

export default function middleware(req) {
    let verify = req.cookies.get("loggedin")
    let url = req.url

    if (!verify && url.includes('/admin-pannel')) {
        return NextResponse.redirect('http://localhost:3000/login')
    }

    if (!verify && url.includes('/add-new-album')) {
        return NextResponse.redirect('http://localhost:3000/login')
    }

    if (!verify && url.includes('/edit-album')) {
        return NextResponse.redirect('http://localhost:3000/login')
    }
}
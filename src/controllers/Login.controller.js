const googleLogin = async (req,res) => {
    res.send(req.user)
}

const Login = async (req,res) => {
    res.send('login normal')
}

export {Login, googleLogin}
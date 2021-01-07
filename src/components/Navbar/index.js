import React from "react"
import S from "./style"

const Navbar = (props) => {
    return(
        <S.NavContainer>
            <S.Title>Accurate or Naw</S.Title>
                {props.currentUser.id
                    ?
                        <S.AuthContainer>
                            <S.AuthLink to={`/user/${props.currentUser.id}`}>{props.currentUser.displayName}</S.AuthLink>
                            <S.SignOut onClick={() => {props.signOut()}}>Sign Out</S.SignOut>
                        </S.AuthContainer>
                    :
                        <S.AuthContainer>
                            <S.AuthLink to="/auth/signin">Sign in</S.AuthLink>
                            <S.AuthLink to="/auth/signup">Register</S.AuthLink>
                        </S.AuthContainer>  
                }
        </S.NavContainer>
    )
}

export default Navbar
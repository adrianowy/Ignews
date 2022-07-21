import { ActiveLink } from '../ActiveLink';
import {SignInButton} from './../SignInButton';
import styles from './styles.module.scss';
import Image from 'next/image'

export function Header (){

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image src="/images/logo.svg" alt="igNews" width={50} height={50}/>
                <nav>

                    <ActiveLink href="/" activeClassName={styles.active}>
                        <a className={styles.active}>Home</a>
                    </ActiveLink>

                    <ActiveLink href="/posts" activeClassName={styles.active} prefetch>
                        <a>Posts</a>
                    </ActiveLink>

                </nav>
                <SignInButton/>
            </div>
        </header>
    );
}
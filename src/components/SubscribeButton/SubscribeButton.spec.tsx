import {fireEvent, render, screen} from '@testing-library/react'
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { SubscribeButton } from './'

jest.mock('next-auth/client', () => {
    return {
        useSession() {
            return [null, false]
        },
        signIn: jest.fn(),
    }
});

/*
jest.mock('next/router'), () => {
    return {
        useRouter() {
            return {
                push: jest.fn()
            }
        }
    }
};
*/

describe('SubscribeButton Component', () => {
    it('renders correctly', () => {
        render(<SubscribeButton />)

        expect(screen.getByText('Subscribe')).toBeInTheDocument()
    });

    it('redirects user to sign in when not autheticated', () => {
        
        const signInMocket = jest.mocked(signIn);
        
        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe');
        fireEvent.click(subscribeButton)

        expect(signInMocket).toHaveBeenCalled();
    });

    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = jest.mocked(useRouter);

        const pushMock = jest.fn();

        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe');
        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalled();
        
    });
})
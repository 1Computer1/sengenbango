import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { FaX } from 'react-icons/fa6';

export interface CustomDialogProps {
	button: React.ReactNode;
	title: React.ReactNode;
	children: React.ReactNode;
}

export function CustomDialog({ button, title, children }: CustomDialogProps) {
	return (
		<DialogTrigger>
			<Button>{button}</Button>
			<ModalOverlay
				isDismissable
				className="fixed z-20 inset-0 flex flex-col justify-center items-center w-screen h-[100dvh] h-screen bg-black bg-opacity-20"
			>
				<div className="flex flex-col justify-center items-center">
					<Modal className="max-w-[100vw] max-h-[100dvh] max-h-screen">
						<Dialog className="flex flex-col max-w-[100vw] max-h-[100dvh] max-h-screen px-4 py-8">
							{({ close }) => (
								<>
									<div className="flex flex-row justify-between items-center w-full bg-zinc-400 dark:bg-zinc-800 dark:text-gray-300 rounded-t-xl p-2 px-3">
										<Heading level={1} className="text-2xl font-bold">
											{title}
										</Heading>
										<Button autoFocus onPress={close}>
											<FaX />
										</Button>
									</div>
									<div className="bg-white dark:bg-zinc-900 dark:text-gray-300 rounded-b-xl shadow overflow-auto p-4 lg:px-8">
										{children}
									</div>
								</>
							)}
						</Dialog>
					</Modal>
				</div>
			</ModalOverlay>
		</DialogTrigger>
	);
}

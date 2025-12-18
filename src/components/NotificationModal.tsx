import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./lightswind/dialog";


interface NotificationModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function NotificationModal({ open, setOpen }: NotificationModalProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="h-auto min-h-[60vh]">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl mb-4">Уважаемые гости!</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-white text-lg">
                    Информируем вас, что с 1 января в связи с ростом стоимости закупки кальянных табаков и сырья, мы вынуждены немного повысить цены на кальяны.
                    <br /><br />
                    Ориентировочный рост составит 10%, что обусловлено повышением акцизов, увеличением ставки НДС до 22%, и повышением цен на закупку.
                    <br /><br />
                    <br /><br />
                    Благодарим за понимание и верность!
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}
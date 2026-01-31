import { DateFilter, Notifications, Theme } from './HeaderComponents';

export default function Header({ DateValue, onDateChange, tempDate, showDateFilter = true }) {
    return (
        <header className='h-20 w-full bg-background text-foreground p-2 px-4 flex justify-between items-center'>
            <div>
                <p className='text-xl font-bold'>Welcome <span className='text-primary'>User</span></p>
                <span className='text-sm'>Start you <span className='font-medium'>Persona</span><span className='text-primary font-bold'>AI</span> Journey</span>
            </div>
            <div>
                <p className='text-sm font-bold'>
                    Date Set : {tempDate}
                </p>
            </div>
            <div className='w-fit h-20 flex items-center gap-2'>
                {showDateFilter && <DateFilter value={DateValue} onValueChange={onDateChange} />}
                <Notifications />
                <Theme />
            </div>
        </header>
    )
}
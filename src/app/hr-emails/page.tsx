'use client';

import HrEmailList from './components/HrEmailList';
import SendAllBar from './components/SendAllBar';
import { useHrContacts, useSendAllHrEmails } from './utils/hooks';

export default function HrEmailsPage() {
  const { contacts, isUpdating, updateContacts } = useHrContacts();
  const { selectedTab, setSelectedTab, isSending, progress, total, sendAll } =
    useSendAllHrEmails(contacts);

  return (
    <section className="flex h-full min-h-0 flex-col p-3 pl-0">
      <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] p-4">
        <SendAllBar
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
          isSending={isSending}
          progress={progress}
          total={total}
          onSendAll={sendAll}
          isUpdating={isUpdating}
          onUpdate={updateContacts}
        />
        <HrEmailList companies={contacts} />
      </div>
    </section>
  );
}

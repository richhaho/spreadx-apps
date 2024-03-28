<script setup >
import { usePettyCashStore } from "@/store/petty_cash";
import { ref } from "vue";
const pettyCashStore = usePettyCashStore();
pettyCashStore.$subscribe(() => { });

const business_info = ref(JSON.parse(localStorage.getItem("activeBusiness")));
const vendor_id = ref(localStorage.getItem("vendor_id"));
const getOrderBills = ref(pettyCashStore.$state.getOrderBills); 
const dateRange = ref(new Date());

const resolveStatus = ((status) => {
  switch (status) {
    case 1:
      return {
        status: "Approved",
        color: "success"
      }
      break;
    case 2:
      return {
        status: "Transfered",
        color: "secondary"
      }
      break;
    case 3:
      return {
        status: "Confirmed",
        color: "primary"
      }
      break;
    case 4:
      return {
        status: "Rejected",
        color: "error"
      }
      break;
    default:
      return {
        status: "Pending",
        color: "info"
      }
      break;
  }
});

const isRejectDialog = ref(false);
const isUpdateRequestLoading = ref(false);
const rejectRequestForm = ref();
const rejection_reason = ref('');
const selectedRowData = ref();
const selectedStatus = ref();
const accountUpdateData = {

}

const accountRequestUpdate = ((newStatus) => {
  pettyCashStore.updateRequestStatus({
    description: rejection_reason.value,
    old_status: selectedRowData.value.status,
    new_status: newStatus,
    request_id: selectedRowData.value.id,
  })
});


const onRejectRequestFormSubmit = (() => {
  rejectRequestForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      pettyCashStore.$state.isUpdateRequestLoading = true
      pettyCashStore.updateRequestStatus({
        description: rejection_reason.value,
        old_status: selectedRowData.value.status,
        new_status: selectedStatus.value,
        request_id: selectedRowData.value.id,
      })
    }
  }).then(() => {
    // isUpdateRequestLoading.value = false
  });
});

const currentPage = ref(1);
const totalPage = ref(1);
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

const items = ref(
  [5, 10, 20, 30, 50]
)

const itemsPerPage = ref(10)
const searchQuery = ref('');
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = options => {
  page.value = options.page

  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order

  pettyCashStore.getAccountRequest({
    business_id: business_info.value.id,
    vendor_id: vendor_id.value,
    page: options.page,
    per_page: itemsPerPage.value
  })
}


// Headers

const headers = [
  {
    title: '#',
    key: 'id',
  },
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Order No',
    key: 'invoice_no',
  },
  {
    title: 'Amount',
    key: 'price',
  },
  {
    title: 'Date',
    key: 'created_at',
  },
  {
    title: 'Category',
    key: 'category',
  },
  {
    title: 'Group',
    key: 'group',
  },
  {
    title: 'Vendor',
    key: 'vendor',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    align: "end"
  },
]

const requests      = computed(() => pettyCashStore.$state.accountrequests);

const totalRequests = computed(() => pettyCashStore.$state.accountrequestsTotal);


function fetchOrderBills() {
  pettyCashStore.getOrderBills({
    business_id: business_info.value.id,
    vendor_id: vendor_id.value,
    page: page.value,
    per_page: itemsPerPage.value
  })
}

fetchOrderBills();

</script>
<template>
  <div>
    TEST
  </div>
</template>

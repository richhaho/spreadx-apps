<script setup >
import { requiredValidator } from "@/@core/utils/validators";
import { useUserStore } from "@/store/userStore";
import { ref } from "vue";
const userStore = useUserStore();

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },

  deparpartment: {
    type: Object,
    required: false,
    default: () => ({
      name: '',
      code: '',
    }),

  },
})

const deparpartment = ref(structuredClone(toRaw(props.deparpartment)))

const emit = defineEmits([
  'update:isDialogVisible',
  'submitDepartment',
])

const departmentRefForm = ref();

const onFormSubmit = () => {
  userStore.$state.isDepartmentSaving = true
  departmentRefForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      // emit('update:isDialogVisible', false)
      emit('submitDepartment', deparpartment.value)
    }
  })
}

const dialogModelValueUpdate = val => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <div class="">
    <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 650"
      :model-value="props.isDialogVisible"
      @update:model-value="dialogModelValueUpdate">
      <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

      <!-- Dialog Content -->
      <VCard title="CREATE NEW DEPARTMENT">
        <VDivider />
        <VForm ref="departmentRefForm" @submit.prevent="onFormSubmit">
          <VCardText>
            <VCol cols="12"
              class="px-0">
              <VTextField v-model="deparpartment.name"
                :rules="[requiredValidator]"
                label="Department Name" />
            </VCol>
          </VCardText>

          <VCardText>
            <VCol cols="12"
              class="px-0">
              <VTextField v-model="deparpartment.code"
                :rules="[requiredValidator]"
                label="Department Code" />
            </VCol>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <div v-if="userStore.$state.isDepartmentSaving">
              <VProgressCircular indeterminate
                color="info" />
            </div>
            <div v-else>
              <VBtn variant="tonal"
                color="secondary"
                class="mx-1"
                @click="dialogModelValueUpdate(false)">
                Close
              </VBtn>
              <VBtn type="submit">
                Save Department
              </VBtn>
            </div>
          </VCardText>
        </VForm>
      </VCard>

      
    </VDialog>
  </div>
</template>